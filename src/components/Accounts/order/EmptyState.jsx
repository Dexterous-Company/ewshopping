import React from 'react';
import { FaBoxOpen, FaSearch, FaFilter } from 'react-icons/fa';
import Button from '@mui/material/Button';

const EmptyState = ({
  title = "No results found",
  description = "We couldn't find what you're looking for",
  icon = "default",
  action,
  className = ""
}) => {
  // Define icons for different states
  const icons = {
    default: <FaBoxOpen className="text-gray-400" size={48} />,
    search: <FaSearch className="text-gray-400" size={48} />,
    filter: <FaFilter className="text-gray-400" size={48} />,
    orders: <FaBoxOpen className="text-gray-400" size={48} />
  };

  // Select the appropriate icon
  const IconComponent = typeof icon === 'string' ? icons[icon] || icons.default : icon;

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="mb-4">
        {IconComponent}
      </div>
      <h3 className="text-xl font-medium text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mb-6">{description}</p>
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
};

// Specific variations for different use cases
EmptyState.Orders = ({ hasFilters, onClearFilters }) => (
  <EmptyState
    icon="orders"
    title={hasFilters ? "No orders match your filters" : "You haven't placed any orders yet"}
    description={
      hasFilters
        ? "Try adjusting your filters or search criteria"
        : "When you place orders, they'll appear here"
    }
    action={
      hasFilters && (
        <Button
          variant="contained"
          color="primary"
          onClick={onClearFilters}
        >
          Clear all filters
        </Button>
      )
    }
  />
);

EmptyState.Search = ({ searchQuery, onClearSearch }) => (
  <EmptyState
    icon="search"
    title={`No results for "${searchQuery}"`}
    description="Try a different search term or check your spelling"
    action={
      <Button
        variant="outlined"
        color="primary"
        onClick={onClearSearch}
      >
        Clear search
      </Button>
    }
  />
);

EmptyState.Filter = ({ onClearFilters }) => (
  <EmptyState
    icon="filter"
    title="No matching results"
    description="The current filters don't match any items"
    action={
      <Button
        variant="outlined"
        color="primary"
        onClick={onClearFilters}
      >
        Reset filters
      </Button>
    }
  />
);

export default EmptyState;