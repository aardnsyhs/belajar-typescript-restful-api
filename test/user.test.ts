import { logger } from "../src/application/logging";
import { web } from "./../src/application/web";
import supertest from "supertest";
import { UserTest } from "./test-util";

describe("POST /api/users", () => {
  afterEach(async () => {
    await UserTest.delete();
  });

  it("should reject register new user if request is invalid", async () => {
    const response = await supertest(web).post("/api/users").send({
      username: "",
      name: "",
      password: "",
    });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should register new user", async () => {
    const response = await supertest(web).post("/api/users").send({
      username: "test",
      name: "test",
      password: "test",
    });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("test");
    expect(response.body.data.name).toBe("test");
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should be able to login", async () => {
    const response = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "test",
    });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("test");
    expect(response.body.data.name).toBe("test");
    expect(response.body.data.token).toBeDefined();
  });

  it("should reject login user if username is wrong", async () => {
    const response = await supertest(web).post("/api/users/login").send({
      username: "salah",
      password: "test",
    });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.message).toBeDefined();
    expect(response.body.message).toBe("Username or password is wrong");
  });

  it("should reject login user if password is wrong", async () => {
    const response = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "salah",
    });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.message).toBeDefined();
    expect(response.body.message).toBe("Username or password is wrong");
  });
});