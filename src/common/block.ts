import Api from "./lib/api";

export default class Block {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  public getBlockById(id: String){
    return this.api.get(`/block/hash/${id}`).then(response => {
      return response.data;
    });
  }
  public getBlockByHeight(height: number){
    return this.api.get(`/block/height/${height}`).then(response => {
      return response.data;
    });
  }
  public getcurrentBlock(){
    return this.api.get(`/current_block`).then(response => {
      return response.data;
    });
  }
}
