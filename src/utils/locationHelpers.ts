import fetch from 'node-fetch'
import { IActivities, UserModel } from '../models/index'
import { log } from './logging'

interface AndOptions {
  _id: { $ne: string }
}

interface QueryOptions {
  $and: (
    | AndOptions
    | { location?: { $geoWithin: { $centerSphere: [number[], number] } } }
    | { $or?: IActivities[] }
  )[]
}

export const getLocationHelper = async (address) => {
  try {
    const url = `http://api.positionstack.com/v1/forward?access_key=${process.env.POSITIONSTACK_KEY}&query=${address}`
    const response = await fetch(url)
    //TODO handle non 200 responses (200 means ok)
    const responseJson = await response.json()
    log(responseJson)
    return responseJson.data
  } catch (expection) {
    console.log(
      'something went wrong with getLocationHelper function',
      expection
    )
  }
}

export const getUsersWithinRadius = async (
  coordinates?: number[],
  radius?: number,
  activities?: string,
  userId?: string
) => {
  try {
    // let splitInterests = interests?.split(",") || [];
    // let interestQuery = [];
    // for(let interest of splitInterests){
    //     const queryInterestObject = {};
    //     queryInterestObject[`interests.${interest}`] = true;
    //     interestQuery.push(queryInterestObject);
    // }

    const splitActivities: string[] = activities?.split(',') || []
    const activityQuery: IActivities[] = []
    for (const activity of splitActivities) {
      const queryActivityObject = {}
      queryActivityObject[`activities.${activity}`] = true
      activityQuery.push(queryActivityObject)
    }

    const findQuery: QueryOptions = {
      $and: [{ _id: { $ne: userId } }],
    }
    if (coordinates.length === 2 && radius) {
      findQuery.$and.push({
        location: {
          $geoWithin: {
            $centerSphere: [[coordinates[0], coordinates[1]], radius / 3963.2],
          },
        },
      })
    }
    // if (interests){
    //     findQuery.$and.push({ $or: interestQuery });
    // }
    if (activities) {
      findQuery.$and.push({ $or: activityQuery })
    }

    const results = await UserModel.find(findQuery)

    return results
  } catch (expection) {
    console.log(
      'Something went wrong with getUserWithRadius function',
      expection
    )
  }
}
