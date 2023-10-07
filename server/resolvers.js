import { getJobs, getTotalJobs, getJob, getJobsByCompany, createJob, deleteJob, updateJob } from "./db/jobs.js";
import { getCompany } from "./db/companies.js";
import { GraphQLError } from "graphql";

export const resolvers = {
    Query: {
        jobs: async (_, { limit, offset }) => {
            const items = await getJobs(limit, offset);
            const totalCount = await getTotalJobs();

            return {
                items,
                totalCount
            }
        },
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

    Mutation: {
        createJob: (_, { input: { title, description } }, { user }) => {
            if (!user) {
                throw new unauthorizedError('Missing authentication');
            }

            return createJob({ companyId: user.companyId, title, description });
        },

        deleteJob: async (_, { id }, { user }) => {
            if (!user) {
                throw new unauthorizedError('Missing authentication');
            }

            const job = await deleteJob(id, user.companyId);

            if (!job) {
                throw new notFoundError(`Job not found: ${id}`);
            }

            return job;
        },

        updateJob: async (_, { input: { id, title, description } }, { user }) => {
            if (!user) {
                throw new unauthorizedError('Missing authentication');
            }

            const job = await updateJob({ id, title, description, companyId: user.companyId });

            if (!job) {
                throw new notFoundError(`Job not found: ${id}`);
            }

            return job;
        }
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

function unauthorizedError(message) {
    return new GraphQLError(message, { extensions: { code: 'UNAUTHORIZED' } });
}

function toIsoDate(value) {
    return value.slice(0, 'yyyy-MM-dd'.length)
}