import Warehouse from "@/models/WarehouseModel";
import {connect} from "@/dbConfig/db"
connect();

type warehouseObj={
  name:string,
  owner:string,
  address:string,
  capacity:number,
  pricePerMonth:number,
  facilities:string,
  startDate:Date,
  endDate:Date,
  photos:string,
  status:string,
}

export default async function getWarehouseData(_id: string) {
  try {
    const Warehouses:warehouseObj[]=await Warehouse.find({_id});
    return Warehouses;
  } catch (error) {
    console.log(error)
    return -1;
  }
}