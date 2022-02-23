import amqp from 'amqplib/callback_api';

export async function connect(url: string | amqp.Options.Connect): Promise<amqp.Connection> {
    return new Promise((resolve, reject) => {
        amqp.connect(url, function (error, connection) {
            if (error) {
                reject(error)
                return;
            }
            resolve(connection);
        })
    })
}
export async function channel(connection: amqp.Connection): Promise<amqp.Channel> {
    return new Promise((resolve, reject) => {
        connection.createChannel(function (error, channel) {
            if (error) {
                reject(error)
                return;
            }
            resolve(channel)
        })
    })
}
export async function queue(channel: amqp.Channel, queue?: string): Promise<amqp.Replies.AssertQueue> {
    return new Promise((resolve, reject) => {
        channel.assertQueue(queue === undefined ? '' : queue, { exclusive: true }, function (error, q) {
            if (error) {
                reject(error);
                return;
            }
            resolve(q)
        })
    })
}