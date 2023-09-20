import { useParams } from 'react-router';
import { useEffect, useState, Link } from 'react';
import { getCompany } from '../lib/graphql/queries'
import JobList from '../components/JobList';

function CompanyPage() {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    getCompany(companyId).then(setCompany);
  }, [companyId])

  if (!company) {
    return <div>Loading...</div>
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
