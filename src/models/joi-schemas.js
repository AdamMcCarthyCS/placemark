import Joi from "joi";

export const PlaceSpec = {
  name: Joi.string().required(),
  latitude: Joi.number.required(),
  longitude: Joi.number.required(),
  category: Joi.string.required(),
  description: Joi.string.required(),
}

export const UserSpec = {
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};

export const UserCredentialSpec = {
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};

export const PlaylistSpec = {
  title: Joi.string().required(),
};

export const TrackSpec = {
  title: Joi.string().required(),
  artist: Joi.string().required(),
  duration: Joi.number().allow("").optional(),
};
