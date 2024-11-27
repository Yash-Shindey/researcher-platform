import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface Researcher {
  _id: string;
  authfull: string;
  inst_name: string;
  cntry: string;
  metrics: {
    h23: number;
    nc9623: number;
    selfCitationExcluded: {
      h23: number;
      nc9623: number;
    };
  };
  fields: {
    primary: {
      name: string;
      rank: number;
    };
    secondary: Array<{
      name: string;
      fraction: number;
    }>;
  };
}

interface Filters {
  search: string;
  country: string;
  field: string;
  institution: string;
  sortBy: 'h23' | 'citations' | 'name';
  sortOrder: 'asc' | 'desc';
}

const ResearcherList = () => {
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    country: '',
    field: '',
    institution: '',
    sortBy: 'h23',
    sortOrder: 'desc'
  });
  const [filterOptions, setFilterOptions] = useState({
    countries: [],
    institutions: [],
    fields: []
  });

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await api.get('/researchers/filters');
        setFilterOptions(response.data);
      } catch (err) {
        console.error('Error fetching filters:', err);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchResearchers = async () => {
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
        
        const response = await api.get(`/researchers?${params.toString()}`);
        setResearchers(response.data.researchers);
      } catch (err) {
        setError('Failed to fetch researchers');
        console.error('Error fetching researchers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResearchers();
  }, [filters]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search researchers..."
            className="border p-2 rounded"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          <select
            className="border p-2 rounded"
            value={filters.country}
            onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
          >
            <option value="">All Countries</option>
            {filterOptions.countries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          <select
            className="border p-2 rounded"
            value={filters.field}
            onChange={(e) => setFilters(prev => ({ ...prev, field: e.target.value }))}
          >
            <option value="">All Fields</option>
            {filterOptions.fields.map((field) => (
              <option key={field} value={field}>{field}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Researchers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {researchers.map((researcher) => (
          <div key={researcher._id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold mb-2">{researcher.authfull}</h2>
            <p className="text-sm text-gray-600 mb-1">{researcher.inst_name}</p>
            <p className="text-sm text-gray-600 mb-2">{researcher.cntry}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-50 p-2 rounded">
                <p className="font-semibold">h-index</p>
                <p>{researcher.metrics.h23}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="font-semibold">Citations</p>
                <p>{researcher.metrics.nc9623}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="font-semibold">Field</p>
                <p>{researcher.fields.primary.name}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="font-semibold">Rank</p>
                <p>{researcher.fields.primary.rank}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResearcherList;
