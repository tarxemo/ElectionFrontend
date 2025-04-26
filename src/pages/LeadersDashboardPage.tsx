// src/pages/LeadersDashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import {
  GET_ALL_WON_LEADERS,
  GET_LEADER_STATS,
  GET_COLLEGE_LIST,
  GET_POSITION_LIST
} from '../api/queries';
import { Table, Select, Input, Button, Pagination, Card } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { ComparativeBarChart } from '../components/charts/ComparativeBarChart';
import { DonutChart } from '../components/charts/DonutChart';
import { RadialBarChartComponent } from '../components/charts/RadialBarChart';
import { StackedBarChart } from '../components/charts/StackedBarChart';
import Navbar from '../components/Navbar';

interface Leader {
  id: string;
  student: {
    user: {
      username: string;
      firstName: string;
      lastName: string;
    };
    college: {
      id: string;
      name: string;
    };
    hostel: {
      name: string;
    };
  };
  position: {
    id: string;
    name: string;
    level: string;
  };
  voteCount: number;
  rating?: number;
  promisesCompleted?: number;
}

interface FilterParams {
  position?: string;
  college?: string;
  level?: string;
  search?: string;
}

const LeadersDashboardPage: React.FC = () => {
  // State for filters and pagination
  const [filters, setFilters] = useState<FilterParams>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('voteCount');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('descend');
  const [visualizationType, setVisualizationType] = useState<'table' | 'bar' | 'radial' | 'donut'>('table');

  // Fetch data
  const { data: leadersData, loading, error, refetch } = useQuery(GET_ALL_WON_LEADERS, {
    variables: {
      filters: {
        ...filters,
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        sortBy: sortField,
        sortOrder: sortOrder === 'ascend' ? 'ASC' : 'DESC'
      }
    }
  });

  const { data: statsData } = useQuery(GET_LEADER_STATS);
  const { data: collegesData } = useQuery(GET_COLLEGE_LIST);
  const { data: positionsData } = useQuery(GET_POSITION_LIST);

  // Prepare data for display
  const leaders: Leader[] = leadersData?.allWonLeaders?.leaders || [];
  const totalLeaders = leadersData?.allWonLeaders?.totalCount || 0;
  const stats = statsData?.leaderStats;

  // Prepare filter options
  const collegeOptions = collegesData?.collegeList?.map((college: any) => ({
    value: college.id,
    label: college.name
  })) || [];

  const positionOptions = positionsData?.positionList?.map((position: any) => ({
    value: position.id,
    label: position.name
  })) || [];

  const levelOptions = [
    { value: 'UNIVERSITY', label: 'University Level' },
    { value: 'COLLEGE', label: 'College Level' },
    { value: 'HOSTEL', label: 'Hostel Level' }
  ];

  // Handle table changes (sorting, pagination)
  const handleTableChange: TableProps<Leader>['onChange'] = (
    pagination,
    filters,
    sorter
  ) => {
    if (Array.isArray(sorter)) {
      // Handle multiple sorters (not implemented here)
    } else {
      if (sorter.field) {
        setSortField(sorter.field as string);
        setSortOrder(sorter.order || 'descend');
      }
    }
    if (pagination.current) setCurrentPage(pagination.current);
    if (pagination.pageSize) setPageSize(pagination.pageSize);
  };

  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1); // Reset to first page when filters change
    refetch();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({});
    setCurrentPage(1);
    setSortField('voteCount');
    setSortOrder('descend');
  };

  // Prepare data for visualizations
  const leadersChartData = leaders.map(leader => ({
    name: `${leader.student.user.firstName} ${leader.student.user.lastName}`,
    votes: leader.voteCount,
    position: leader.position.name,
    college: leader.student.college.name
  }));

  const positionDistributionData = leaders.reduce((acc: Record<string, number>, leader) => {
    acc[leader.position.name] = (acc[leader.position.name] || 0) + 1;
    return acc;
  }, {});

  const positionDonutData = Object.entries(positionDistributionData).map(([name, value]) => ({
    name,
    value
  }));

  // Table columns
  const columns: ColumnsType<Leader> = [
    {
      title: 'Leader',
      dataIndex: ['student', 'user', 'firstName'],
      key: 'name',
      render: (_, record) => (
        <div>
          <div className="font-medium">{`${record.student.user.firstName} ${record.student.user.lastName}`}</div>
          <div className="text-sm text-white">{record.student.user.username}</div>
        </div>
      ),
      sorter: true
    },
    {
      title: 'Position',
      dataIndex: ['position', 'name'],
      key: 'position',
      filters: positionOptions,
      filteredValue: filters.position ? [filters.position] : null,
      sorter: true,
      render: (_, record) => (
        <div>
          <div>{record.position.name}</div>
          <div className="text-sm text-white">{record.position.level.replace('_LEVEL', '')}</div>
        </div>
      )
    },
    {
      title: 'College',
      dataIndex: ['student', 'college', 'name'],
      key: 'college',
      filters: collegeOptions,
      filteredValue: filters.college ? [filters.college] : null,
      sorter: true
    },
    {
      title: 'Votes',
      dataIndex: 'voteCount',
      key: 'votes',
      sorter: true,
      render: (votes) => votes.toLocaleString()
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      sorter: true,
      render: (rating) => rating ? rating.toFixed(1) : 'N/A'
    },
    {
      title: 'Promises',
      dataIndex: 'promisesCompleted',
      key: 'promises',
      render: (completed, record) => (
        <div>
          {completed !== undefined ? (
            <span className="font-medium">{completed}%</span>
          ) : (
            <span>N/A</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Leaders Dashboard</h1>
          <p className="text-[#FFE31A]">Comprehensive overview of all elected leaders</p>
        </div>
{/* Stats Cards */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
  <div className="shadow-sm rounded-full p-4 flex flex-col justify-center items-center text-center bg-gray-700">
    <h3 className="text-white">Total Leaders</h3>
    <p className="text-2xl font-bold text-[#FFE31A]">{stats?.totalLeaders || 0}</p>
  </div>
  <div className="shadow-sm rounded-full p-4 flex flex-col justify-center items-center text-center bg-gray-700">
    <h3 className="text-white">Avg Rating</h3>
    <p className="text-2xl font-bold text-[#FFE31A]">{stats?.avgRating ? stats.avgRating.toFixed(1) : 'N/A'}</p>
  </div>
  <div className="shadow-sm rounded-full p-4 flex flex-col justify-center items-center text-center bg-gray-700">
    <h3 className="text-white">Avg Promise Completion</h3>
    <p className="text-2xl font-bold text-[#FFE31A]">{stats?.avgPromiseCompletion ? `${stats.avgPromiseCompletion}%` : 'N/A'}</p>
  </div>
  <div className="shadow-sm rounded-full p-4 flex flex-col justify-center items-center text-center bg-gray-700">
    <h3 className="text-white">Active Positions</h3>
    <p className="text-2xl font-bold text-[#FFE31A]">{stats?.totalPositions || 0}</p>
  </div>
</div>


        {/* Filters */}
        <div className="bg-gray-700 p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Position</label>
              <Select
                className="w-full"
                placeholder="Filter by position"
                options={positionOptions}
                value={filters.position}
                onChange={(value) => setFilters({...filters, position: value})}
                allowClear
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">College</label>
              <Select
                className="w-full"
                placeholder="Filter by college"
                options={collegeOptions}
                value={filters.college}
                onChange={(value) => setFilters({...filters, college: value})}
                allowClear
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Level</label>
              <Select
                className="w-full"
                placeholder="Filter by level"
                options={levelOptions}
                value={filters.level}
                onChange={(value) => setFilters({...filters, level: value})}
                allowClear
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Search</label>
              <Input
                placeholder="Search leaders..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                allowClear
              />
            </div>
            <div className="flex items-end space-x-2">
              <Button type="primary" onClick={applyFilters}>
                Apply
              </Button>
              <Button onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Visualization Toggle */}
        <div className="flex justify-end mb-4">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setVisualizationType('table')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${visualizationType === 'table' ? 'bg-gray-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-50'}`}
            >
              Table
            </button>
            <button
              onClick={() => setVisualizationType('bar')}
              className={`px-4 py-2 text-sm font-medium ${visualizationType === 'bar' ? 'bg-gray-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-50'}`}
            >
              Bar Chart
            </button>
            <button
              onClick={() => setVisualizationType('radial')}
              className={`px-4 py-2 text-sm font-medium ${visualizationType === 'radial' ? 'bg-gray-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-50'}`}
            >
              Radial
            </button>
            <button
              onClick={() => setVisualizationType('donut')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${visualizationType === 'donut' ? 'bg-gray-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-50'}`}
            >
              Donut
            </button>
          </div>
        </div>

        {/* Main Content */}
        {visualizationType === 'table' && (
          <div className="bg-gray-700 rounded-lg shadow-sm overflow-hidden">
            <Table
              columns={columns}
              dataSource={leaders}
              rowKey="id"
              loading={loading}
              onChange={handleTableChange}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: totalLeaders,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100']
              }}
              scroll={{ x: true }}
            />
          </div>
        )}

        {visualizationType === 'bar' && (
          <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Leaders by Vote Count</h3>
            <div className="h-96">
              <ComparativeBarChart
                data={leadersChartData}
                title="Votes Received"
                xAxisLabel="Leader"
                yAxisLabel="Votes"
              />
            </div>
          </div>
        )}

        {visualizationType === 'radial' && (
          <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Leaders Performance</h3>
            <div className="h-96">
              <RadialBarChartComponent
                data={leadersChartData.map(leader => ({
                  name: leader.name,
                  value: leader.votes
                }))}
                title="Votes"
                innerRadius={30}
                outerRadius={120}
              />
            </div>
          </div>
        )}

        {visualizationType === 'donut' && (
          <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Position Distribution</h3>
            <div className="h-96">
              <DonutChart
                data={positionDonutData}
                title="Positions"
                innerRadius={70}
                outerRadius={90}
              />
            </div>
          </div>
        )}

        {/* Additional Visualizations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Votes by Position</h3>
            <div className="h-80">
              <StackedBarChart
                data={leadersChartData}
                bars={[
                  { dataKey: 'votes', name: 'Votes', color: '#FFE31A' }
                ]}
                xAxisLabel="Position"
                yAxisLabel="Votes"
              />
            </div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Leaders by College</h3>
            <div className="h-80">
              <DonutChart
                data={leaders.reduce((acc: Record<string, number>, leader) => {
                  acc[leader.student.college.name] = (acc[leader.student.college.name] || 0) + 1;
                  return acc;
                }, {})}
                title="Colleges"
                innerRadius={50}
                outerRadius={70}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadersDashboardPage;