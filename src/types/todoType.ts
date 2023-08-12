type ChildrenTodo = {
  key: string;
  parentKey: number;
  label: string;
  type: string;
  date: string;
};

type Todo = {
  key: number;
  label: string;
  status: boolean;
  importance: string;
  children: [ChildrenTodo];
};

export { Todo, ChildrenTodo };
