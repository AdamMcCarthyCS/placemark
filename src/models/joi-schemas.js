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

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");
                                                                                     
export const UserCredentialSpec = Joi.object()
.keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const UserSpec = UserCredentialSpec
  .keys({
    firstName: Joi.string().example("Adam").required(),
    lastName: Joi.string().example("McCarthy").required(),
    role: Joi.string().example("user"),
  })
  .label("UserDetails");

export const UserSpecPlus = UserSpec
  .keys({
    _id: IdSpec,
    __v: Joi.number(),
  }).label("UserDetailsPlus")


export const UserArray = Joi.array().items(UserSpecPlus).label("UserArray");



export const PlaylistSpec = {
  title: Joi.string().required(),
};

export const TrackSpec = {
  title: Joi.string().required(),
  artist: Joi.string().required(),
  duration: Joi.number().allow("").optional(),
};
