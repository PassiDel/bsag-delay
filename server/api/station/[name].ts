export default defineEventHandler(event => {

  const {name: rawName} = event.context.params!!

  const name = decodeURI(rawName)
  if (name === 'Bremen Duckwitzstraße') throw createError({
    statusCode: 404,
    statusMessage: `Not found: "${name}"`
  })

  return {
    name,
    count: 22,
    avg: 4,
    lat: 52.0134,
    lon: 8.293
  }
})