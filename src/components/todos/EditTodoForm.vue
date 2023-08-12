<template>
  <div class="todo-form-container">
    <h3>Edit todo</h3>
    <div>
      <div>
        <div class="description-container">
          <div class="title-input">
            <span class="p-float-label">
              <InputText id="username" v-model="titleInputValue" />
              <label for="username">Todo title</label>
            </span>
          </div>
          <div class="description-input">
            <span class="p-float-label">
              <Textarea
                v-model="descriptionInputValue"
                :autoResize="false"
                rows="10"
                cols="30"
              />
              <label>Todo description</label>
            </span>
          </div>
        </div>
      </div>
      <!-- <div class="todo-importance">
        <h4>Importance</h4>
      </div> -->
      <!-- <div class="due-task-time">
        <h4>Due to:</h4>
        <div class="due-to-calendar">
          <Calendar
            placeholder="Calendar"
            v-model="dueDate"
            class="additional-calendar-styles-new-task"
          />
        </div>
      </div> -->

      <div class="todo-completed">
        <h4>Complete status</h4>
        <div class="flex align-items-center">
          <Checkbox
            v-model="todoStatusValue"
            inputId="todo_check"
            name="todo_check"
            :binary="true"
          />
          <label for="todo_check" class="ml-2"> Set as completed </label>
        </div>
        <div class="due-to">
          <p>Due to: {{ dueToValue }}</p>
        </div>
      </div>

      <div class="form-buttons-container">
        <Button
          label="Cancel"
          text
          raised
          rounded
          icon="pi pi-times"
          @click="$emit('abortChanges')"
        />
        <Button
          label="Save"
          autofocus
          raised
          icon="pi pi-check"
          rounded
          @click="saveChanges"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
// import RadioButton from "primevue/radiobutton";
import Checkbox from "primevue/checkbox";
// import Calendar from "primevue/calendar";
import Button from "primevue/button";
import { useStore } from "vuex";
import { useToast } from "vue-toastification";
import { Todo } from "@/types/todoType";

const emit = defineEmits(["abortChanges"]);

const store = useStore();
const toast = useToast();

const props = defineProps({
  todoKey: Number,
});

const foundTaskValue = ref<Todo>();

const titleInputValue = ref("");
const descriptionInputValue = ref("");
const todoStatusValue = ref();
const dueToValue = ref();

const saveChanges = (): void => {
  if (!titleInputValue.value.trim().length) {
    toast.error("Title is required!");
    return;
  }

  if (!descriptionInputValue.value.trim().length) {
    toast.error("Description is required!");
    return;
  }

  const objectCopy = Object.assign({}, foundTaskValue.value);

  objectCopy.label = titleInputValue.value;
  objectCopy.status = todoStatusValue.value;
  objectCopy.children[0].label = descriptionInputValue.value;

  store.dispatch("editTodo", objectCopy);
  toast.success("Task has been updated");
  emit("abortChanges");
};

//find dask by id
const findTask = (id: number | undefined): void => {
  console.log("ID", id);
  if (id === null || id === undefined) return;

  const foundTask = store.state.todoList.find((todo: Todo) => todo.key === id);

  foundTaskValue.value = foundTask;

  titleInputValue.value = foundTask.label;
  descriptionInputValue.value = foundTask.children[0].label;
  todoStatusValue.value = foundTask.status;
  dueToValue.value = foundTask.children[0].date;
};

//Call findtask function on component mounted
onMounted(() => {
  findTask(props.todoKey);
});

//Watching for todo change
watch(
  () => props.todoKey,
  (n, o) => {
    findTask(n);
  }
);
</script>

<style></style>
