import url from 'url'
import Calendar from 'node-google-calendar'
import accountKey from '../service-account-key.json'
import appconfig from '../appconfig.json'

export default async function (req, res) {
  const searchParam = new url.URLSearchParams(req.url)

  let timeMin = null
  let timeMax = null
  for (const key of searchParam.keys()) {
    if (key.endsWith('timeMin')) {
      timeMin = searchParam.get(key)
    }
    if (key.endsWith('timeMax')) {
      timeMax = searchParam.get(key)
    }
  }

  if (!timeMin || !timeMax) {
    res.writeHead(400)
    res.end()
    return
  }

  const calendarId = appconfig.calendarId
  const calendarConfig = {
    calendarUrl: appconfig.calendarUrl,
    serviceAcctId: accountKey.client_id,
    calendarId: {
      cal: calendarId
    },
    key: accountKey.private_key,
    timezone: appconfig.timezone
  }

  const googleCalendar = new Calendar(calendarConfig)

  const params = {
    timeMin,
    timeMax
  }

  try {
    const calendarEvents = await googleCalendar.Events.list(calendarId, params)
    res.writeHead(200, { 'Content-Type': 'Content-Type: application/json' })
    res.write(JSON.stringify(calendarEvents.map(event => ({ id: event.id, name: event.summary, start: event.start, end: event.end }))))
  } catch (err) {
    res.writeHead(500)
    res.write(JSON.stringify(err))
  } finally {
    res.end()
  }
}
