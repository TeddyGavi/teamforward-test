import fetch from 'node-fetch'
import { log } from '../utils/logging'
import { Request, Response } from 'express'

export class LocationController {
  constructor() {}

  //use for debugging or if we do full address searches
  async getLocation(req: Request, res: Response) {
    //req is a full address or zipcode
    //if using full address need mechanism to feed back address options and select the correct one.
    const address = '98034'
    //TODO: get address of of request ie user.address
    const url = `http://api.positionstack.com/v1/forward?access_key=${process.env.POSITIONSTACK_KEY}&query=${address}`
    const response = await fetch(url)
    const responseJson = await response.json()
    log(responseJson)
    res.json(responseJson)
  }
}
