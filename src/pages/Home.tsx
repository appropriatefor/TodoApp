import { useState, useEffect } from "react";
import { AddTaskBtn, ProfileAvatar, Tasks } from "../components";
import {
  DeleteDoneBtn,
  GreetingHeader,
  GreetingText,
  TaskCompletionText,
  TaskCountHeader,
  TaskCountTextContainer,
  TasksCount,
  TasksCountContainer,
} from "../styles";
import { UserProps } from "../types/user";
import {
  displayGreeting,
  getRandomGreeting,
  getTaskCompletionText,
} from "../utils";
import { Delete } from "@mui/icons-material";
import { Emoji } from "emoji-picker-react";
import { Box, CircularProgress, Typography } from "@mui/material";

export const Home = ({ user, setUser }: UserProps) => {
  const [randomGreeting, setRandomGreeting] = useState<string>("");
  const [completedTasksCount, setCompletedTasksCount] = useState<number>(0);
  const [tasksWithDeadlineTodayCount, setTasksWithDeadlineTodayCount] =
    useState<number>(0);

  const completedTaskPercentage =
    (completedTasksCount / user.tasks.length) * 100;

  useEffect(() => {
    setRandomGreeting(getRandomGreeting());
    document.title = "Todo App";
  }, []);

  useEffect(() => {
    const count = user.tasks.filter((task) => task.done).length;
    setCompletedTasksCount(count);
  }, [user.tasks]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRandomGreeting(getRandomGreeting());
    }, 6000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    const count = user.tasks.filter((task) => {
      if (task.deadline) {
        const taskDeadline = new Date(task.deadline).setHours(0, 0, 0, 0);
        return taskDeadline === today && !task.done;
      }
      return false;
    }).length;
    setTasksWithDeadlineTodayCount(count);
  }, [user.tasks]);
  const handleDeleteDone = () => {
    setUser((prevUser) => {
      const updatedTasks = prevUser.tasks.filter((task) => !task.done);
      return { ...prevUser, tasks: updatedTasks };
    });
  };

  return (
    <>
      <ProfileAvatar user={user} setUser={setUser} />
      <GreetingHeader>
        <Emoji unified="1f44b" emojiStyle={user.emojisStyle} /> &nbsp;{" "}
        {displayGreeting()}
        {user.name && ", " + user.name}
      </GreetingHeader>
      <GreetingText key={randomGreeting}>{randomGreeting}</GreetingText>
      {user.tasks.length > 0 && (
        <TasksCountContainer>
          <TasksCount>
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <CircularProgress
                variant="determinate"
                value={completedTaskPercentage}
                size={64}
                thickness={5}
                style={{
                  filter: "drop-shadow(0 0 6px #b624ff)",
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="caption"
                  component="div"
                  color="white"
                  sx={{ fontSize: "16px" }}
                >{`${Math.round(completedTaskPercentage)}%`}</Typography>
              </Box>
            </Box>
            <TaskCountTextContainer>
              <TaskCountHeader>
                You have {user.tasks.length - completedTasksCount} unfinished
                tasks{" "}
                {completedTasksCount > 0 && `and ${completedTasksCount} done`}
              </TaskCountHeader>
              <TaskCompletionText>
                {getTaskCompletionText(completedTaskPercentage)}
              </TaskCompletionText>
              {tasksWithDeadlineTodayCount > 0 && (
                <span>Tasks due today: {tasksWithDeadlineTodayCount}</span>
              )}
            </TaskCountTextContainer>
          </TasksCount>
        </TasksCountContainer>
      )}
      <Tasks user={user} setUser={setUser} />
      {user.tasks.some((task) => task.done) && (
        <DeleteDoneBtn onClick={handleDeleteDone}>
          <Delete /> &nbsp; Delete done
        </DeleteDoneBtn>
      )}
      <AddTaskBtn animate={user.tasks.length === 0} />
    </>
  );
};
