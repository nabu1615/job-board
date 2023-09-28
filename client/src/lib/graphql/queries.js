import { getAccessToken } from '../auth';
import { ApolloClient, InMemoryCache, gql, createHttpLink, concat, ApolloLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'http://localhost:9000/graphql',
})

const authLink = new ApolloLink((operation, forward) => {
  const token = getAccessToken();

  if (token) {
    operation.setContext({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  }

  return forward(operation);
})


const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache()
})

export async function deleteJob(id) {
  const mutation = gql`
    mutation DeleteJob($id: ID!) {
        deleteJob(id: $id) {
            id,
            title
        }
    }`;

  const { data: { job } } = await apolloClient.mutate({
    mutation, variables: { id }
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

  const { data: { job } } = await apolloClient.mutate({
    mutation,
    variables: {
      input: {
        title,
        description
      }
    }
  })

  return job;
}

export async function getJobs() {
  const query = gql`
    query GetJobs {
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

  const { data: { jobs } } = await apolloClient.query({ query })

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

  const { data: { job } } = await apolloClient.query({ query, variables: { id } });

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

  const { data: { company } } = await apolloClient.query({ query, variables: { id } })

  return company;
}