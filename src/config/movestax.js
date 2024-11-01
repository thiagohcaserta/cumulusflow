export function defineMovestaxConfig(config = {}) {
  return {
    regions: config.regions || ['auto'],
    maxDuration: config.maxDuration || 60000,
    memory: config.memory || '128MB',
    scaling: {
      minInstances: config.scaling?.minInstances || 1,
      maxInstances: config.scaling?.maxInstances || 10,
      targetConcurrency: config.scaling?.targetConcurrency || 80
    },
    cache: {
      ttl: config.cache?.ttl || 3600,
      staleWhileRevalidate: config.cache?.staleWhileRevalidate || 300
    },
    database: {
      type: config.database?.type || 'serverless',
      region: config.database?.region || 'auto',
      pooling: {
        min: config.database?.pooling?.min || 2,
        max: config.database?.pooling?.max || 10
      }
    }
  };
}