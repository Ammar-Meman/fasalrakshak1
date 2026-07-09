import Feedback from '../../models/Feedback.js';

export const processFeedback = async (recommendationId, context) => {
    // Registers a pending feedback loop for the recommendation
    const feedback = new Feedback({
        recommendationId,
        kisanId: context.kisanId,
        status: 'Pending'
    });
    await feedback.save();
    return feedback;
};

export const registerOutcome = async (recommendationId, status, farmerRating) => {
    // Triggered later when the farmer reports success/failure
    return await Feedback.findOneAndUpdate(
        { recommendationId },
        { status, farmerRating, timestamp: new Date() },
        { new: true }
    );
};
