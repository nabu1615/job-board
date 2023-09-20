import { GraphQLClient, gql } from 'graphql-request';


const client = new GraphQLClient('http://localhost:9000/graphql');


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