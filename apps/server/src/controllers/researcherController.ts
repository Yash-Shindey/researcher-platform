import { Request, Response } from 'express';
import { ResearcherModel } from '../models/Researcher';
import { Researcher } from '../types/researcher.types';

export class ResearcherController {
  async getResearchers(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const field = req.query.field as string;
      const country = req.query.country as string;

      const query: any = {};
      
      if (search) {
        query.$or = [
          { authfull: new RegExp(search, 'i') },
          { inst_name: new RegExp(search, 'i') }
        ];
      }

      if (field) {
        query['fields.primary.name'] = field;
      }

      if (country) {
        query.cntry = country;
      }

      const [researchers, total] = await Promise.all([
        ResearcherModel.find(query)
          .sort({ 'metrics.h23': -1 })
          .skip((page - 1) * limit)
          .limit(limit),
        ResearcherModel.countDocuments(query)
      ]);

      res.json({
        researchers,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total
      });
    } catch (error) {
      console.error('Error fetching researchers:', error);
      res.status(500).json({ message: 'Failed to fetch researchers' });
    }
  }

  async getFilters(req: Request, res: Response) {
    try {
      const [countries, institutions, fields] = await Promise.all([
        ResearcherModel.distinct('cntry'),
        ResearcherModel.distinct('inst_name'),
        ResearcherModel.distinct('fields.primary.name')
      ]);

      res.json({ countries, institutions, fields });
    } catch (error) {
      console.error('Error fetching filters:', error);
      res.status(500).json({ message: 'Failed to fetch filters' });
    }
  }

  async getDashboardMetrics(req: Request, res: Response) {
    try {
      const [
        totalResearchers,
        institutionCounts,
        totalCountries,
        topResearchers
      ] = await Promise.all([
        ResearcherModel.countDocuments(),
        ResearcherModel.aggregate([
          { $group: { _id: '$inst_name', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]),
        ResearcherModel.distinct('cntry').then(countries => countries.length),
        ResearcherModel.find()
          .sort({ 'metrics.nc9623': -1 })
          .limit(10)
          .select('authfull inst_name metrics.h23 metrics.nc9623')
      ]);

      const dashboardData = {
        totalResearchers,
        totalInstitutions: await ResearcherModel.distinct('inst_name').then(inst => inst.length),
        totalCountries,
        topInstitutions: institutionCounts.map(inst => ({
          name: inst._id,
          count: inst.count
        })),
        topResearchers: topResearchers.map(r => ({
          authfull: r.authfull,
          inst_name: r.inst_name,
          h23: r.metrics?.h23 || 0,
          citations: r.metrics?.nc9623 || 0
        }))
      };

      res.json(dashboardData);
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      res.status(500).json({ message: 'Failed to fetch dashboard metrics' });
    }
  }
}

// Create single instance of controller
const researcherController = new ResearcherController();
export default researcherController;
