/**
 * @api {get} /todo/task Get all tasks
 * @apiGroup Todo
 * @apiPermission User
 * @apiSuccess (200) {application/json} tasks a list of tasks
*/
module.exports = async function (req, res) {
   // This is a log function we use. It adds some metadata to the log
   // and then uses console.log
   req.ab.log("todo list: get-tasks");

   // This will check that the request is from a valid user  
   if (!(req.ab.validUser(/* false */))) {
      // an error message is automatically returned to the client
      // so be sure to return here;
      return;
   }


   const username = req.ab.user.username;
   // For now we will mock the tasks
   const tasks = [
{
   id: 1,
   task: "Add",
   done: false,
   username: "admin",
},
// Add some tasks of your own here
   ];

   // Only return tasks for the currrent user
   const userTasks = tasks.filter((task) => task.username === username); 

   return res.ab.success(userTasks);
   // this is the same as:
   // res.status(200);
   // res.send(userTasks);
};
