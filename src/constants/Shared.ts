export const allowedExtension = [".png", ".jpg", ".jpeg"];
export const allowedFileSize = 1048576;
export const paymentStatus = {
    Authorised: 1,
    SentForSettle: 2,
    CaptureFailure: 3,
    CancelPayment: 4,
    SentForRefund: 5,
    Settled: 6,
    Pending: 7
}
export const orderTypes = {
    PickupAtCounter: 2,
    PickupAInside: 3,
    Curbside: 4
};
