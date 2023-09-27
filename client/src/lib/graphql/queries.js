import { GraphQLClient, gql } from 'graphql-request';
import { getAccessToken } from '../auth';


const client = new GraphQLClient('http://localhost:9000/graphql', {
  headers: () => {
    const token = getAccessToken();

    if (!token) {
      return {};
    }

    return {
      authorization: token ? `Bearer ${token}` : null,
    };
  }
});


export async function deleteJob(id) {
  const mutation = gql`
    mutation DeleteJob($id: ID!) {
        deleteJob(id: $id) {
            id,
            title
        }
    }`;

  const { job } = await client.request(mutation, {
    id
  })

  return job;

}

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation CreateJob($input: createJobInput!) {
        job: createJob(input: $input) {
            title
            description
            id
        }
    }`;

  const { job } = await client.request(mutation, {
    input: {
      title,
      description
    }
  })

  return job;
}

export async function getJobs() {
  const query = gql`
    query {
        jobs {
          title
          description
          id
          date
          company {
            name
          }
        }
      }`;

  const { jobs } = await client.request(query)

  return jobs;
}

export async function getJob(id) {
  const query = gql`
    query JobById {
        job(id: "${id}") {
          title
          description
          id
          date
          company {
            name
            id
          }
        }
      }`;

  const { job } = await client.request(query, { id })

  return job;
}

export async function getCompany(id) {
  const query = gql`
    query CompanyById {
        company(id: "${id}") {
          id
          name
          description
          jobs {
            id,
            title,
            description,
            date
          }

        }
      }`;

  const { company } = await client.request(query, { id })

  return company;
}