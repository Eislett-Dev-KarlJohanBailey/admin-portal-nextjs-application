import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SubTopicDetails } from "@/models/subTopic/subTopicDetails";
import { SubTopicReqParams } from "@/models/subTopic/subTopicReqParams";

interface SubTopicsState {
  subtopics: SubTopicDetails[];
  filteredSubtopics: SubTopicDetails[];
  reqParams: SubTopicReqParams;
  amount: number;
  isLoading: boolean;
  tableFilters: {
    sortColumn: string;
    sortDirection: "asc" | "desc";
    topicFilter: string;
  };
  deleteData: {
    subtopicId?: string;
    showDeleteDialog: boolean;
    isDeleting: boolean;
  };
}

const initialState: SubTopicsState = {
  subtopics: [],
  filteredSubtopics: [],
  reqParams: {
    page_number: 1,
    page_size: 10,
  },
  amount: 0,
  isLoading: false,
  tableFilters: {
    sortColumn: "name",
    sortDirection: "asc",
    topicFilter: "",
  },
  deleteData: {
    showDeleteDialog: false,
    isDeleting: false,
  },
};

const subtopicsSlice = createSlice({
  name: "subtopics",
  initialState,
  reducers: {
    setSubtopics: (state, action: PayloadAction<SubTopicDetails[]>) => {
      state.subtopics = action.payload;
    },
    setFilteredSubtopics: (state, action: PayloadAction<SubTopicDetails[]>) => {
      state.filteredSubtopics = action.payload;
    },
    setSubtopicsReqParams: (state, action: PayloadAction<Partial<SubTopicReqParams>>) => {
      state.reqParams = { ...state.reqParams, ...action.payload };
    },
    setSubtopicsAmount: (state, action: PayloadAction<number>) => {
      state.amount = action.payload;
    },
    setSubtopicsIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSubtopicsTableFilters: (state, action: PayloadAction<Partial<SubTopicsState["tableFilters"]>>) => {
      state.tableFilters = { ...state.tableFilters, ...action.payload };
    },
    setSubtopicsTableDeleteData: (state, action: PayloadAction<Partial<SubTopicsState["deleteData"]>>) => {
      state.deleteData = { ...state.deleteData, ...action.payload };
    },
  },
});

export const {
  setSubtopics,
  setFilteredSubtopics,
  setSubtopicsReqParams,
  setSubtopicsAmount,
  setSubtopicsIsLoading,
  setSubtopicsTableFilters,
  setSubtopicsTableDeleteData,
} = subtopicsSlice.actions;

// Selectors
export const getSubtopics = (state: { subtopics: SubTopicsState }) => state.subtopics.subtopics;
export const getFilteredSubtopics = (state: { subtopics: SubTopicsState }) => state.subtopics.filteredSubtopics;
export const getSubtopicsReqParams = (state: { subtopics: SubTopicsState }) => state.subtopics.reqParams;
export const getSubtopicsAmount = (state: { subtopics: SubTopicsState }) => state.subtopics.amount;
export const getSubtopicsIsLoading = (state: { subtopics: SubTopicsState }) => state.subtopics.isLoading;
export const getSubtopicsTableFilters = (state: { subtopics: SubTopicsState }) => state.subtopics.tableFilters;
export const getSubtopicsTableDeleteData = (state: { subtopics: SubTopicsState }) => state.subtopics.deleteData;

export default subtopicsSlice.reducer; 