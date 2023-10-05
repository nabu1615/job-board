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

const jobByIdQuery = gql`
    query JobById($id: ID!) {
        job(id: $id) {
          id
          date
          title
          company {
            id
            name
          }
          description
        }
      }`;


export const apolloClient = new ApolloClient({
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
          id
          date
          title
          company {
            id
            name
          }
          description
        }
    }`;

  const { data: { job } } = await apolloClient.mutate({
    mutation,
    variables: {
      input: {
        title,
        description
      }
    },
    update: (cache, { data: { job } }) => {
      cache.writeQuery({
        query: jobByIdQuery,
        variables: { id: job.id },
        data: { job }
      })
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

  const { data: { jobs } } = await apolloClient.query({ query, fetchPolicy: 'network-only' });

  return jobs;
}

export async function getJob(id) {
  const { data: { job } } = await apolloClient.query({ query: jobByIdQuery, variables: { id }, });

  return job;
}


export const getCompanyQuery = gql`
    query CompanyById($id: ID!) {
        company(id: $id) {
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

