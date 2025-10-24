
import React from 'react';
import type { GoldPrice } from '../types';

interface DataTableProps {
  goldData: GoldPrice[];
}

const DataTable: React.FC<DataTableProps> = ({ goldData }) => {
  if (goldData.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        <p>No data available. Start the service to fetch prices.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700/50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Buy (VND)
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Sell (VND)
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {goldData.map((item, index) => (
            <tr key={index} className="hover:bg-gray-700/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{item.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-300">{item.buy}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-300">{item.sell}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
