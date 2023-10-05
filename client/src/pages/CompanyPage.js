import { useParams } from 'react-router';
import { getCompanyQuery } from '../lib/graphql/queries'
import JobList from '../components/JobList';
import { useQuery } from '@apollo/client';

function CompanyPage() {
  const { companyId } = useParams();
  const { data, loading, error } = useQuery(getCompanyQuery, {
    variables: {
      id: companyId
    }
  })

  if (loading) {
    return <div>Loading...</div>
  }

  const { company } = data;

  if (error) {
    return <div className='has-text-danger'>Data unavailable</div>
  }

  return (
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>
      <h2>Jobs:</h2>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
