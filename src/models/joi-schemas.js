import Joi from "joi";

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



export const PlaceSpec = Joi.object()
  .keys({
    name: Joi.string().required().example("Pot of Gold"),
    latitude: Joi.number().required().example(52.123),
    longitude: Joi.number().required().example(-7.456),
    description: Joi.string().required().example("A place to visit"),
    category: Joi.string().required().example("Landmark"),
    eircode: Joi.string().required().example("R95 AZ09"), 
    userid: IdSpec,
  })
  .label("Place");

export const PlaceSpecPlus = PlaceSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("PlacePlus");

export const PlaceArraySpec = Joi.array().items(PlaceSpecPlus).label("PlaceArray");

