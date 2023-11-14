import { createAsyncThunk } from '@reduxjs/toolkit';
import { get, post } from '../../libs/client/apiClient';
import { PlannerDataTypes } from '../../types';

const getPlanners = createAsyncThunk('planner/get', async () => {
  try {
    const { data } = await get('/planner');
    return data.data;
  } catch (error) {
    throw error;
  }
});

const createPlanner = createAsyncThunk('planner/create', async ({ planner }: { planner: PlannerDataTypes }) => {
  try {
    const { data } = await post('/planner/create', planner);
    return data.data;
  } catch (error) {
    throw error;
  }
});

export { getPlanners, createPlanner };