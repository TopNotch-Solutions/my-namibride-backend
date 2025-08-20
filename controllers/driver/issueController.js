const Issue = require("../../models/issue");

exports.createIssue = async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "User id is required" });
  }
  if (!title) {
    return res.status(400).json({ message: "Issue title is required" });
  }
  if (!description) {
    return res.status(400).json({ message: "Description is required" });
  }
  try {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0); 

    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999);

    const existingIssue = await Issue.findOne({
      userId: id,
      title: title,
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    if (existingIssue) {
      return res.status(409).json({ 
        message: "An issue with this title has already been reported today by this user."
      });
    }
    await Issue.create({
      userId: id,
      title,
      description,
      date: Date.now(),
    });
    const data = await Issue.find({userId: id});
    return res.status(201).json({
      message: "Issue successfully created.",
      data
    });
  } catch (error) {
    console.error("Error registering passager:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.all = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "User id is required" });
  }

  try {
    const allIssuesUser = await Issue.find({
      userId: id,
    });

    if (allIssuesUser.length === 0) {
      return res.status(200).json({
        message: "There are no issue for the current users.",
        data: [],
      });
    }
    return res.status(201).json({
      message: "Issue retrieved successfully.",
      data: allIssuesUser,
    });
  } catch (error) {
    console.error("Error registering passager:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Issue id is required" });
  }

  try {
  const deletedIssue = await Issue.findByIdAndDelete({
      _id: id,
    });

     if (!deletedIssue) {
      return res.status(404).json({ message: "Issue with the provided id does not exist." });
    }

    return res.status(200).json({
      message: "Issue successfully deleted.",
    });
  } catch (error) {
    console.error("Error registering passager:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
