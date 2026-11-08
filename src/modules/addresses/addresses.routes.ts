import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth/authentication.middleware";
import { AddressesController } from "./addresses.controller";
import { AddressesRepository } from "./addresses.repository";
import { AddressesService } from "./addresses.service";

const router = Router()
const addressesRepository = new AddressesRepository()
const addressesService = new AddressesService(addressesRepository)
const addressesController = new AddressesController(addressesService)

router.post("/", isAuthenticated, addressesController.createAddress)
router.get("/", isAuthenticated, addressesController.getAddresses)
router.get("/:addressId", isAuthenticated, addressesController.getAddress)
router.put("/:addressId", isAuthenticated, addressesController.updateAddress)
router.delete("/:addressId", isAuthenticated, addressesController.deleteAddress)

export default router
