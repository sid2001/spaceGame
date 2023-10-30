exports.getGame = async (req,res,next)=>{
  console.log("ek");
  res.render("game.ejs");
  next();
}