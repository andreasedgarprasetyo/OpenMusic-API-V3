/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
class ActivitiesHandler {
  constructor(activitiesService, playlistService) {
    this._activitiesService = activitiesService;
    this._playlistsService = playlistService;

    this.postActivityHandler = this.postActivityHandler.bind(this);
    this.getActivitiesHandler = this.getActivitiesHandler.bind(this);
  }

  async postActivityHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    const activityId = await this._activitiesService.addActivity(id);

    const response = h.response({
      status: "success",
      message: "Activity berhasil ditambahkan",
      data: {
        activityId,
      },
    });
    response.code(201);
    return response;
  }

  async getActivitiesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;

    await this._playlistsService.verifyPlaylistOwner(id, credentialId);
    const data = await this._activitiesService.getActivities(id);

    return {
      status: "success",
      data,
    };
  }
}

module.exports = ActivitiesHandler;
