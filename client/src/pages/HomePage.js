import JobList from '../components/JobList';
import { useJobs } from '../lib/graphql/hooks';
import { useState } from 'react';

const PAGE_SIZE = 5;

function HomePage() {
  const [page, setPage] = useState(1);
  const { jobs, loading, error } = useJobs(PAGE_SIZE, (page - 1) * PAGE_SIZE);

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className='has-text-danger'>Data unavailable</div>
  }

  const totalPages = Math.ceil(jobs.totalCount / PAGE_SIZE);

  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>

      <JobList jobs={jobs.items} />
      <div className='flex justify-content-center w-full align-items-center'>
        <button disabled={page === 1} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <span className='mx-2'>{page} of {totalPages}</span>
        <button disabled={page === totalPages} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default HomePage;
