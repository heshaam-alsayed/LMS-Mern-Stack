import { Router } from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/authMiddleware";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller";

const router = Router();

router.use(isAuthenticated);
router.use(authorizeRoles("admin"));

router.route("/").post(createCategory).get(getAllCategories);

router
  .route("/:categoryId")
  .get(getCategoryById)
  .patch(updateCategory)
  .delete(deleteCategory);

export default router;
