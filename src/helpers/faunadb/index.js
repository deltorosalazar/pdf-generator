const fauna = require('faunadb'); // Importamos la librería

const client = new fauna.Client({
  secret: process.env.FAUNA_KEY,
  domain: 'db.us.fauna.com'
});

const q = fauna.query

async function saveRecord(record) {
  try {
    const request = q.Create(q.Collection('emails'), {
      data: {
        id: record.id,
        email: record.email,
        status: record.status,
        queue: new Date().getTime()
      }
    })

    let res = await client.query(request)
    return res

  } catch (error) {
    console.log('asc', error)
    throw new Error(error)
  }
}

async function updateRecord(id, status) {
  const query = q.Update(
    q.Select(['ref'], q.Get(q.Match(
      q.Index("get_email_by_id"), id
    ))),
    { data: { status: status, sent: new Date().getTime() } }
  )
  const response = await client.query(query);
  return response
}




module.exports = {
  saveRecord,
  updateRecord
};
