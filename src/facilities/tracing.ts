import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
//   import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';

const oltpExporter = new OTLPTraceExporter({
    url: `https://api.honeycomb.io/v1/traces`,
    headers: {
        'x-honeycomb-team': process.env.HONEYCOMB_API_KEY,
    },
});

const otelSDK = new NodeSDK({
    // metricExporter: new PrometheusExporter({
    //   port: 8081,
    // }),
    // metricInterval: 1000,
    spanProcessor: new BatchSpanProcessor(oltpExporter),
    contextManager: new AsyncLocalStorageContextManager(),
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]:
            process.env.APP_ID +
            (process.env.NODE_ENV === 'local' ? '-local' : ''),
    }),
    instrumentations: [
        new HttpInstrumentation({
            ignoreOutgoingRequestHook: (request) => {
                let result = false;
                if (request.hostname === 'mainnet.infura.io') result = true;
                return result;
            },
        }),
        new ExpressInstrumentation(),
        new NestInstrumentation(),
    ],
});

export default otelSDK;

process.on('SIGTERM', () => {
    otelSDK
        .shutdown()
        .then(
            () => console.log('SDK shut down successfully'),
            (err) => console.log('Error shutting down SDK', err),
        )
        .finally(() => process.exit(0));
});
