import Joi from "joi";

export const PlaceSpec = {
  name: Joi.string().required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  eircode: Joi.string().required(),
  category: Joi.string().required(),
  description: Joi.string().required(),
}

export const UpdatePlaceSpec = {
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  eircode: Joi.string().required(),
  category: Joi.string().required(),
  description: Joi.string().required(),
}

export const UserSpec = Joi.object()
.keys({
  firstName: Joi.string().example("Adam").required(),
  lastName: Joi.string().example("McCarthy").required(),
  email: Joi.string().email().example("adam@mccarthy.com").required(),
  password: Joi.string().example("secret password").required(),
}).label("UserDetails")

export const UserArray = Joi.array().items(UserSpec).label("UserArray");

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
