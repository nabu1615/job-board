import { getJobs, getJob, getJobsByCompany } from "./db/jobs.js";
import { getCompany } from "./db/companies.js";
import { GraphQLError } from "graphql";

export const resolvers = {
    Query: {
        jobs: () => getJobs(),
        job: async (_, { id }) => {
            const job = await getJob(id);

            if (!job) {
                throw new notFoundError(`Job not found: ${id}`);
            }

            return job;
        },
        company: async (_, { id }) => {
            const company = await getCompany(id);

            if (!company) {
                throw new notFoundError(`Company not found: ${id}`);
            }

            return company;
        },
    },

    Job: {
        company: ({ companyId }) => getCompany(companyId),
        date: ({ createdAt }) => toIsoDate(createdAt)
    },

    Company: {
        jobs: (company) => getJobsByCompany(company.id)
    }
}

function notFoundError(message) {
    return new GraphQLError(message, { extensions: { code: 'NOT_FOUND' } });
}

function toIsoDate(value) {
    return value.slice(0, 'yyyy-MM-dd'.length)
}