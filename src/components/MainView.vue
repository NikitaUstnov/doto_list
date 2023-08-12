<template>
  <div class="main-container">
    <transition name="slide-fade">
      <div class="todos-container">
        <NewTodo @openAddTaskBar="openNewTaskBar" />
        <div class="todo-list-header-wrapper">
          <div class="todo-list-header">
            <TabView
              class="tabview-custom"
              @tab-change="handleTabChangeOrdersTable"
            >
              <TabPanel>
                <template #header>
                  <h3>
                    Today
                    <Badge :value="todaysTodosQty"></Badge>
                  </h3>
                </template>
              </TabPanel>
              <TabPanel>
                <template #header>
                  <h3>
                    Tomorrow
                    <Badge :value="tomorrowTodosQty"></Badge>
                  </h3>
                </template>
              </TabPanel>
              <TabPanel>
                <template #header>
                  <h3>
                    Done <Badge :value="store.state.doneList.length"></Badge>
                  </h3>
                </template>
              </TabPanel>
              <TabPanel>
                <template #header>
                  <h3>
                    Failed
                    <Badge :value="store.state.failedList.length"></Badge>
                  </h3>
                </template>
              </TabPanel>
            </TabView>
            <Calendar
              placeholder="Calendar"
              v-model="todoDate"
              class="additional-calendar-styles"
            />
          </div>
        </div>
        <div class="todo-list-container">
          <h3 v-if="!sortedTodos.length" style="text-align: left">No todos</h3>
          <Tree v-else :value="sortedTodos" class="additional-tree-styles">
            <template #default="data">
              <div class="todo-list-item-label">
                <p>{{ data.node.label }}</p>
                <Tag
                  :value="checkImportance(data.node.importance).text"
                  :severity="checkImportance(data.node.importance).severity"
                />
              </div>
            </template>

            <template #text="slotProps">
              <div class="item-settings">
                <span>{{ slotProps.node.label }}</span>
                <span style="margin-left: 30px; color: #2c3e50"
                  >Due to: {{ slotProps.node.date }}</span
                >
                <div class="item-action-buttons">
                  <Button
                    v-if="selectedTabIndex !== 3"
                    title="Edit todo"
                    severity="warning"
                    rounded
                    icon="pi pi-pencil"
                    @click="editTodo($event, slotProps.node.parentKey)"
                  />
                  <Button
                    title="Delete todo"
                    severity="danger"
                    rounded
                    icon="pi
                  pi-trash"
                    @click="removeTodo($event, slotProps.node)"
                  />
                </div>
              </div>
            </template>
          </Tree>
        </div>
      </div>
    </transition>
    <transition name="slide-fade">
      <div
        v-if="newTaskBarVisible || editTodoVisible"
        class="right-sidebar-container"
      >
        <NewTodoForm v-if="newTaskBarVisible" @abortTask="cancelAddingTask" />
        <EditTodoForm
          v-if="editTodoVisible"
          :todoKey="todoKey"
          :tabindex="selectedTabIndex"
          @abortChanges="cancelEditTask"
        />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useStore } from "vuex";
import NewTodo from "@/components/todos/NewTodo.vue";
import NewTodoForm from "@/components/todos/NewTodoForm.vue";
import EditTodoForm from "@/components/todos/EditTodoForm.vue";
import Tree from "primevue/tree";
import Button from "primevue/button";
import Badge from "primevue/badge";
import Calendar from "primevue/calendar";
import Tag from "primevue/tag";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { formatDate } from "@/utils/formatDate";
import { Todo, ChildrenTodo } from "@/types/todoType";

const store = useStore();

//todo key for editing
const todoKey = ref(0);

//New Todo sidebar state
const newTaskBarVisible = ref(false);

//Edit todo sidebar state
const editTodoVisible = ref(false);

//qty todays todos
const todaysTodosQty = ref(0);

//qty of tomorrow todos
const tomorrowTodosQty = ref(0);

//Todos date
const todoDate = ref();

const selectedTabIndex = ref(0);

//sort todos by date
const sortedTodos = computed(() => {
  // Return todos for today by default
  if (selectedTabIndex.value === 0) {
    const todayTodos = store.state.todoList.filter((todo: Todo) => {
      return todo.children[0].date === formatDate(new Date());
    });
    return todayTodos;
  }
  // If target date selected return todos by selected date
  if (selectedTabIndex.value === 1) {
    const todosByDate = store.state.todoList.filter((todo: Todo) => {
      return todo.children[0].date === formatDate(todoDate.value);
    });
    return todosByDate;
  }

  if (selectedTabIndex.value === 2) {
    return store.state.doneList;
  }

  if (selectedTabIndex.value === 3) {
    return store.state.failedList;
  }
});

//watch for tabs changes
const handleTabChangeOrdersTable = ({ index }: any) => {
  selectedTabIndex.value = index;

  switch (index) {
    case 0:
      todoDate.value = null;
      break;
    case 1:
      let date = new Date();
      date.setDate(date.getDate() + 1);

      todoDate.value = date;
      break;
    default:
      break;
  }
};

const openNewTaskBar = (): void => {
  if (editTodoVisible.value) editTodoVisible.value = false;
  newTaskBarVisible.value = true;
};

const editTodo = (event: any, key: number): void => {
  if (newTaskBarVisible.value) newTaskBarVisible.value = false;

  todoKey.value = key;

  editTodoVisible.value = true;
};

const removeTodo = (event: any, todo: ChildrenTodo): void => {
  console.log(todo);
  if (todo.parentKey === todoKey.value && editTodoVisible.value) {
    editTodoVisible.value = false;
  }

  store.dispatch("removeTodo", {
    todoKey: todo.parentKey,
    tabId: selectedTabIndex.value,
  });
};

const cancelAddingTask = (): void => {
  newTaskBarVisible.value = false;
};

const cancelEditTask = (): void => {
  editTodoVisible.value = false;
};

//Check importance of task
const checkImportance = (importance: string): object => {
  switch (importance) {
    case "normal":
      return {
        text: "Normal",
        severity: "info",
      };
      break;
    case "important":
      return {
        text: "Important",
        severity: "warning",
      };
      break;
    case "urgent":
      return {
        text: "Urgent",
        severity: "danger",
      };
      break;

    default:
      return {
        text: "Normal",
        severity: "info",
      };
      break;
  }
};

//calculet todos quantity for today and tomorrow
const calculateTodosQtyForTodatAndTomorrrow = (): void => {
  todaysTodosQty.value = 0;
  tomorrowTodosQty.value = 0;

  for (let index = 0; index < store.state.todoList.length; index++) {
    const todo = store.state.todoList[index];

    if (
      new Date(todo.children[0].date).getTime() ===
      new Date(formatDate(new Date())).getTime()
    ) {
      todaysTodosQty.value += 1;
    }

    let date = new Date();
    date.setDate(date.getDate() + 1);
    if (
      new Date(todo.children[0].date).getTime() ===
      new Date(formatDate(date)).getTime()
    ) {
      tomorrowTodosQty.value += 1;
    }
  }
};

// Watching for todos list state changes and call caltculate function
watch(
  () => store.state.todoList.length,
  (n, o) => {
    calculateTodosQtyForTodatAndTomorrrow();
  }
);

watch(
  () => selectedTabIndex.value,
  (n, o) => {
    newTaskBarVisible.value = false;
    editTodoVisible.value = false;
  }
);

//call get todo function in vuex store
onMounted(() => {
  store.dispatch("getTodos");
});
</script>

<style>
.main-container {
  display: flex;

  height: 100%;
  width: 100%;

  padding: 10px;

  background: #13b3a5;
  overflow: hidden;

  box-shadow: 2px 3px 7px -2px rgb(77, 76, 76);
}

.todos-container {
  width: 100%;

  display: flex;
  flex-direction: column;
}

.todo-list-header-wrapper {
  display: flex;
}

.todo-list-header {
  display: flex;
  align-items: baseline;
  margin: 10px auto 0 0;
}

.todo-list-header ul {
  border: 1px solid transparent !important;
}

.todo-list-header h3 {
  /* margin-left: 10px; */
  cursor: pointer;
}

.todo-list-container {
  height: calc(100% - 100px);
  overflow: auto;
}

.todo-list-item-label {
  display: flex;
  align-items: center;
}

.todo-list-item-label p {
  margin-right: 10px;
}

.additional-calendar-styles {
  background: transparent;
  margin-left: 10px;
}

.additional-calendar-styles input {
  background: transparent !important;
  border: none !important;
}

.additional-calendar-styles input:enabled:focus {
  box-shadow: none !important;
}

.right-sidebar-container {
  width: 40%;

  background: rgb(34, 195, 182);
  background: linear-gradient(0deg, #22c3b6 0%, rgba(253, 212, 45, 1) 100%);
  border-radius: 20px;

  margin-left: 20px;
}

.additional-tree-styles {
  background: transparent !important;
  border: none !important;
}

.item-settings {
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100% !important;
}

.item-action-buttons button {
  margin-left: 10px;

  width: 30px !important;
  height: 30px !important;
}

.item-label {
  display: flex;
  align-items: center;
}

.todo-list-header a,
.todo-list-header .p-tabview-panels {
  background: transparent !important;
}

@media screen and (min-width: 769px) {
  .main-container {
    height: 80%;
    width: 80%;

    border-radius: 20px;

    padding: 20px;
  }
}
</style>
