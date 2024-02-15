# Explaining JavaScript Promises #

Here's a metaphor that might help you to understand how my code with state and Promises works.

JavaScript has a single _thread_ where all the code that you write is executed. "Single" means that only one thing can happen at any one time. One line of code will execute, and then the next, and then the next, one line at a time. This is called "synchronous" code, meaning "happening at successive instants in time."

You, as a human being, live a _synchronous_ life. You live each moment one after the other. Your attention is focused on one thing at a time... but your focus can be interrupted. An alarm bell, your son with something important to say, a knock on your door... there are many events that can make you stop what you are doing and go and do something else. You can come back and finish what you were doing later.

When you send a text message, or order something online, or put a cake in the oven to cook, you are starting a process that you don't need to focus on. You can go and do something else while you are waiting for the response to your message, or the delivery guy, or for the kitchen timer to ring.

Asynchronous code works in a similar way. You can start a process (like fetching data from an API, recording audio from the end-user's microphone, or asking a question in the Terminal using readline-sync), and then let your program focus on something else until it is interrupted by the code equivalent of a doorbell ringing when the process ends.

In high school, you had a number of different classes to go to in any school day. For example: history, maths, language studies...

You carried a bag with you where you kept all your textbooks and notebooks. You went into one classroom and opened your history textbook and your history notebook, and you worked on history until a bell rang. Your teacher probably gave you a list of tasks to do as homework. When the bell rang, you made a note of what you should do next for history, and put your books into your bag and went to the next class, where you repeated a similar process for maths.

You can think of your homework as an asynchronous process. You _will_ do it, but later, at a time when you don't have a scheduled class. And when you are next scheduled to see your history teacher, you can hand in your work... or skip the class, or give an excuse for not having done it. 

As far as your teacher is concerned, giving you homework is like making you promise to do some work. You can resolve this promise by handing in your completed homework, or you can reject it and say "My dog ate my paper."

The textbooks and notebooks in the bag that you carry allow you to do one thing at a time, and to change the thing that you are doing when a scheduled interruption (like the school bell) occurs, or when you have idle time between scheduled activities. Each time you put your books away and move to a new classroom and take out another set of books, and prepare your mind for a new subject is a waste of time, so it's good to stay focused on one subject until it's done, then clear it from your mind, and voluntarily move on to the next task.

In the same way, your computer needs to keep track of what it was doing before it was interrupted, and refresh its memory each time it switches to another uncompleted task.

In the code where I use Promises, the `state` variable that is sent to each function is like the schoolbag that contains all the data that you might need. The calls to `rl.question` are like the teacher instructing you to some work to do, and the callback function is where the work gets done. Like with your homework, it doesn't have to be done immediately.

When the work is finished, the callback function calls `resolve`, which hands your work back to the teacher, who can then continue with the next topic that needs to be treated.

There is just a single "thread" (you/the JavaScript engine) who "listens to the instructions" and "who does the work", but because of the way tasks are scheduled and interrupted, it doesn't matter exactly when the work gets done.

When you re-read my code with this metaphor in mind, is it easier to understand?




