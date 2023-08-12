import { createStore } from "vuex";
import { Todo } from "../types/todoType";
import { formatDate } from "../utils/formatDate";

export interface State {
  todoList: Todo[];
  failedList: Todo[];
  doneList: Todo[];
}

export default createStore<State>({
  state: (): State => ({
    todoList: [],
    failedList: [],
    doneList: [],
  }),
  getters: {},
  mutations: {
    setTodos: (state, array) => (state.todoList = array),
    setFailedList: (state, array) => (state.failedList = array),
    setDoneList: (state, array) => (state.doneList = array),
  },
  actions: {
    /**
     * Getting todos from local storage. Like requet to db.
     * Filter by todo status
     */
    getTodos({ state, commit }) {
      commit("setTodos", []);
      commit("setFailedList", []);
      commit("setDoneList", []);

      const savedTodos = localStorage.getItem("todoList");

      if (!savedTodos) return;

      const parcedTodos = JSON.parse(savedTodos);

      for (let index = 0; index < parcedTodos.length; index++) {
        const todoItem = parcedTodos[index];

        if (
          !todoItem.status &&
          new Date(todoItem.children[0].date) < new Date(formatDate(new Date()))
        ) {
          commit("setFailedList", [todoItem, ...state.failedList]);
        } else if (todoItem.status) {
          commit("setDoneList", [todoItem, ...state.doneList]);
        } else if (!todoItem.status) {
          commit("setTodos", [todoItem, ...state.todoList]);
        }
      }
    },

    /**
     * Adding new Todo in todo list and saving in local storage
     * @param todo object
     */
    addTodo({ state, commit }, todo: Todo) {
      commit("setTodos", [todo, ...state.todoList]);
      localStorage.setItem("todoList", JSON.stringify(state.todoList));
      console.log("Todo added");
    },

    /**
     * Removing todo from todo list and saving in local storage
     * @param todoIdentifier object
     */
    removeTodo(
      { state, commit },
      todoIdentifier: { todoKey: number; tabId: number }
    ) {
      const { tabId, todoKey } = todoIdentifier;

      console.log("todoKey: ", todoKey);
      console.log("tabId: ", tabId);
      switch (tabId) {
        case 2: // Remove completed todo from doneList
          const newDoneList = state.doneList.filter(
            ({ key }) => key !== todoKey
          );
          commit("setDoneList", newDoneList);

          console.log("newDoneList", newDoneList);
          break;

        case 3: // Remove failed todo from FailedList
          const newFailedList = state.failedList.filter(
            ({ key }) => key !== todoKey
          );
          commit("setFailedList", newFailedList);
          break;

        default: // by default remove todo from todoList
          const newTodoList = state.todoList.filter(
            ({ key }) => key !== todoKey
          );
          commit("setTodos", newTodoList);

          break;
      }

      //Updating local storage
      const storedTodos: string | null = localStorage.getItem("todoList");

      if (storedTodos) {
        const parcedTodos = JSON.parse(storedTodos);

        const updatedTodos = parcedTodos.filter(
          ({ key }: any) => key !== todoKey
        );

        localStorage.setItem("todoList", JSON.stringify(updatedTodos));
      }
    },

    /**
     * Edding todo`s fields and saving in local storage
     *@param param0 object Updated todo
     *@param param1 number If tabindex 2 we must search todo in doneList
     */
    editTodo({ state, commit }, { edittedTodo, tabindex }) {
      const newTodo = edittedTodo;

      if (tabindex === 2) {
        if (!newTodo.status) {
          commit("setTodos", [newTodo, ...state.todoList]);

          commit(
            "setDoneList",
            state.doneList.filter(({ key }) => key !== newTodo.key)
          );
        } else {
          let indexToUpdate = state.doneList.findIndex(
            (obj) => obj.key === newTodo.key
          );

          const doneTodo = state.doneList;

          doneTodo.splice(indexToUpdate, 1, newTodo);

          commit("setDoneList", doneTodo);
        }
      } else {
        if (!newTodo.status) {
          let indexToUpdate = state.todoList.findIndex(
            (obj) => obj.key === newTodo.key
          );

          const todos = state.todoList;

          todos.splice(indexToUpdate, 1, newTodo);

          commit("setTodos", todos);
        } else {
          commit("setDoneList", [newTodo, ...state.doneList]);

          commit(
            "setTodos",
            state.todoList.filter(({ key }) => key !== newTodo.key)
          );
        }
      }

      //Updating local storage
      const storedTodos: string | null = localStorage.getItem("todoList");

      if (storedTodos) {
        const parsedStoredTodos = JSON.parse(storedTodos);

        let indexToUpdate = parsedStoredTodos.findIndex(
          (obj: Todo) => obj.key === newTodo.key
        );

        const todos = parsedStoredTodos;

        todos.splice(indexToUpdate, 1, newTodo);

        localStorage.setItem("todoList", JSON.stringify(todos));
      }
    },
  },
});
