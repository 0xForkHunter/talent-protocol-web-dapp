import axios from "axios";
import { appendCSRFToken, defaultHeaders } from "./utils";

const getGoals = user => axios.get(`/api/v1/goals?id=${user}`);

const deleteGoal = (user, goalId) => {
  const baseHeaders = defaultHeaders();
  const headers = appendCSRFToken(baseHeaders);

  return axios.delete(`/api/v1/career_goals/${user}/goals/${goalId}`, {
    headers: {
      ...headers
    }
  });
};

export const goalsService = {
  getGoals,
  deleteGoal
};
