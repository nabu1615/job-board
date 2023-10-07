import { useQuery, useMutation } from '@apollo/client';
import { getCompanyQuery, jobByIdQuery, getJobsQuery, createJobMutation } from './queries';

export const useCompany = (id) => {
    const { data, loading, error } = useQuery(getCompanyQuery, {
        variables: {
            id
        }
    })

    return {
        company: data?.company,
        loading,
        error
    }
}

export const useJob = (id) => {
    const { data, loading, error } = useQuery(jobByIdQuery, {
        variables: {
            id
        }
    })

    return {
        job: data?.job,
        loading,
        error
    }
}

export const useJobs = (limit, offset) => {
    const { data, loading, error } = useQuery(getJobsQuery, {
        variables: {
            limit,
            offset
        },
        fetchPolicy: 'network-only',
    })

    return {
        jobs: data?.jobs,
        loading,
        error
    }
}

export const useCreateJob = () => {
    const [mutate, { loading, error }] = useMutation(createJobMutation);

    const createJob = async (title, description) => {
        const { data: { job } } = await mutate({
            variables: {
                input: {
                    title,
                    description,
                },
            },
            update: (cache, { data: { job } }) => {
                cache.writeQuery({
                    query: createJobMutation,
                    variables: { id: job.id },
                    data: { job }
                })
            }
        })

        return job;
    }

    return {
        createJob,
        loading,
        error
    }
}