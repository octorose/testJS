const developers = [
  { name: "Alice", skillLevel: 7, maxHours: 40, preferredTaskType: "feature" },
  { name: "Bob", skillLevel: 9, maxHours: 30, preferredTaskType: "bug" },
  {
    name: "Charlie",
    skillLevel: 5,
    maxHours: 35,
    preferredTaskType: "refactor",
  },
];
const tasks = [
  {
    taskName: "Feature A",
    difficulty: 7,
    hoursRequired: 15,
    taskType: "feature",
    priority: 4,
    dependencies: [],
  },
  {
    taskName: "Bug Fix B",
    difficulty: 5,
    hoursRequired: 10,
    taskType: "bug",
    priority: 5,
    dependencies: [],
  },
  {
    taskName: "Refactor C",
    difficulty: 9,
    hoursRequired: 25,
    taskType: "refactor",
    priority: 3,
    dependencies: ["Bug Fix B"],
  },
  {
    taskName: "Optimization D",
    difficulty: 6,
    hoursRequired: 20,
    taskType: "feature",
    priority: 2,
    dependencies: [],
  },
  {
    taskName: "Upgrade E",
    difficulty: 8,
    hoursRequired: 15,
    taskType: "feature",
    priority: 5,
    dependencies: ["Feature A"],
  },
];
//normally these helpers must be in there own folder each to apply the Single Responsability principe of clean Code but i'll keep ot simple for now

function taskSorting(a, b) {
  if (b.priority !== a.priority) {
    return b.priority - a.priority;
  }
  return a.dependencies.length - b.dependencies.length;
}

function areDependenciesMet(task, devAllocations) {
  return task.dependencies.every((dep) =>
    devAllocations.some((dev) => dev.assignedTasks.includes(dep))
  );
}
//////////////////////////////////////////////////////////////////////////////

function assignTasksWithPriorityAndDependencies(developers, tasks) {
  tasks.sort(taskSorting);

  const unassignedTasks = [];
  const devAllocations = developers.map((dev) => ({
    ...dev,
    assignedTasks: [],
    hoursWorked: 0,
  }));

  tasks.forEach((task) => {
    let taskAssigned = false;

    for (let dev of devAllocations) {
      const {
        skillLevel,
        maxHours,
        preferredTaskType,
        assignedTasks,
        hoursWorked,
      } = dev;

      const skillMatch = skillLevel >= task.difficulty;
      const hoursAvailable = maxHours - hoursWorked >= task.hoursRequired;
      const dependenciesMet = areDependenciesMet(task, devAllocations);
      const typePreference = preferredTaskType === task.taskType;

      if (skillMatch && hoursAvailable && dependenciesMet && typePreference) {
        dev.assignedTasks.push(task.taskName);
        dev.hoursWorked += task.hoursRequired;
        taskAssigned = true;
        break;
      }
    }

    if (!taskAssigned) {
      unassignedTasks.push({
        task: task.taskName,
        reasons: ["No developers available"],
      });
    }
  });



  return { devAllocations, unassignedTasks };
}

const result = assignTasksWithPriorityAndDependencies(developers, tasks);
