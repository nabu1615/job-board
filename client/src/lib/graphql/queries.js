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

export const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache()
})

export const jobByIdQuery = gql`
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

export const createJobMutation = gql`
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


export const getJobsQuery = gql`
    query GetJobs($limit: Int, $offset: Int) {
        jobs(limit: $limit, offset: $offset) {
         items {
          title
          description
          id
          date
          company {
            name
          }
         }
         totalCount
        }
      }`;

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

