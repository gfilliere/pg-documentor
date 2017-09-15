export default (pool, query, transform) =>
  pool.query(query).then(raw => raw.rows.map(transform));
