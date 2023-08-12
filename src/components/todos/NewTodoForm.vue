<template>
  <div class="todo-form-container">
    <h3>Add new todo</h3>
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
      <div class="todo-importance">
        <h4>Importance</h4>
        <div class="radio-importance">
          <div class="flex align-items-center">
            <RadioButton
              v-model="taskImportanceValue"
              inputId="normal"
              name="importance"
              value="normal"
            />
            <label for="normal">Normal</label>
          </div>
          <div class="flex align-items-center">
            <RadioButton
              v-model="taskImportanceValue"
              inputId="important"
              name="importance"
              value="important"
            />
            <label for="important">Important</label>
          </div>
          <div class="flex align-items-center">
            <RadioButton
              v-model="taskImportanceValue"
              inputId="urgent"
              name="importance"
              value="urgent"
            />
            <label for="urgent">Urgent</label>
          </div>
        </div>
      </div>
      <div class="due-task-time">
        <h4>Due to:</h4>
        <div class="due-to-calendar">
          <Calendar
            placeholder="Calendar"
            v-model="dueDate"
            class="additional-calendar-styles-new-task"
          />
        </div>
      </div>

      <div class="form-buttons-container">
        <Button
          label="Cancel"
          text
          raised
          rounded
          icon="pi pi-times"
          @click="$emit('abortTask')"
        />
        <Button
          label="Save"
          autofocus
          raised
          icon="pi pi-check"
          rounded
          @click="addTask"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import RadioButton from "primevue/radiobutton";
import Calendar from "primevue/calendar";
import Button from "primevue/button";
import { useStore } from "vuex";
import { useToast } from "vue-toastification";
import { formatDate } from "@/utils/formatDate";

const store = useStore();
const toast = useToast();

const emit = defineEmits(["abortTask"]);

const titleInputValue = ref("");
const descriptionInputValue = ref("");

//Task importance
const taskImportanceValue = ref("normal");

//Task during time
const dueDate = ref(null);

//Add new task function
const addTask = (): void => {
  if (!titleInputValue.value.trim().length) {
    toast.error("Title is required!");
    return;
  }

  if (!descriptionInputValue.value.trim().length) {
    toast.error("Description is required!");
    return;
  }

  if (
    dueDate.value &&
    new Date(dueDate.value).getTime() <
      new Date(formatDate(new Date())).getTime()
  ) {
    toast.error("You cannot set time earlier than today!");
    return;
  }

  const todoId = Date.now();
  const newTaskObject = {
    key: todoId,
    label: titleInputValue.value,

    status: false,
    importance: taskImportanceValue.value,
    children: [
      {
        parentKey: todoId,
        key: `${todoId}-0`,
        label: descriptionInputValue.value,
        type: "text",
        date: dueDate.value
          ? formatDate(new Date(dueDate.value))
          : formatDate(new Date()),
      },
    ],
  };

  store.dispatch("addTodo", newTaskObject);

  clearFields();

  toast.success("Todo successfully added!");
  emit("abortTask");
};

//reset all fields
const clearFields = (): void => {
  titleInputValue.value = "";
  descriptionInputValue.value = "";
  dueDate.value = null;
};
</script>

<style>
.todo-form-container {
  padding: 0 10px 0 10px;
  height: calc(100% - 10px);
}

.description-container {
  display: flex;
  flex-direction: column;

  width: 100%;

  margin-top: 20px;
}

.todo-form-container > div {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  height: calc(100% - 50px);

  overflow: auto;
}

.todo-form-container > div > div:first-child {
  overflow: auto;
  height: calc(100% - 180px);
  border-radius: 10px;
}

.description-container input,
.description-container textarea {
  width: 100%;

  background: #2be6d6;
  border: none !important;
  border-radius: 20px !important;

  color: #2c3e50;
}

.p-float-label label {
  color: #2c3e50 !important;
}

.description-input {
  margin-top: 30px;
}

.radio-importance {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;

  margin-top: 20px;
}

.radio-importance label {
  margin-left: 5px;
}

.p-radiobutton .p-radiobutton-box {
  background: #2be6d6;
  border: 2px solid #ffd54f;
}

.additional-calendar-styles-new-task {
  width: 100%;

  background: #2be6d6;
  border-radius: 20px;
}

.additional-calendar-styles-new-task input {
  background: transparent !important;
  border: none !important;
}

.additional-calendar-styles-new-task input::placeholder {
  color: #2c3e50 !important;
}

.additional-calendar-styles-new-task input:enabled:focus {
  box-shadow: none !important;
}

.form-buttons-container {
  margin: 10px 5px;

  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-buttons-container button:first-child {
  margin-bottom: 20px;
}

@media screen and (min-width: 768px) {
  .form-buttons-container {
    flex-direction: row;
  }

  .form-buttons-container button:first-child {
    margin-right: 20px;
    margin-bottom: 0;
  }
}
</style>
