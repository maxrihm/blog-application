using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using UserService.Controllers;
using UserService.Data;
using UserService.Dto;
using UserService.Models;
using Xunit;

namespace UserService.Tests
{
    public class AuthControllerTests
    {
        /// <summary>
        /// Test to ensure that the Register method in the AuthController 
        /// returns a BadRequest when trying to register a user with a duplicate username.
        /// </summary>
        [Fact]
        public async Task Register_ReturnsBadRequest_ForDuplicateUsername()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "DuplicateUserTestDb")
                .Options;

            using (var dbContext = new ApplicationDbContext(options))
            {
                // Add a user to the in-memory database to simulate duplicate scenario
                var existingUser = new User
                {
                    Username = "testuser",
                    Password = "testpassword" // This would typically be hashed, not plain text.
                };

                dbContext.Users.Add(existingUser);
                await dbContext.SaveChangesAsync();

                var controller = new AuthController(dbContext, null); // Mock MongoDbContext not used

                // Create a UserDto with the same username
                var userDto = new UserDto
                {
                    Username = "testuser",
                    Password = "differentpassword"
                };

                // Act
                var result = await controller.Register(userDto);

                // Assert
                Assert.IsType<BadRequestObjectResult>(result);
            }
        }

        /// <summary>
        /// Test to ensure that the Register method in the AuthController 
        /// returns a BadRequest when provided with an invalid model state.
        /// </summary>
        [Fact]
        public async Task Register_ReturnsBadRequest_ForInvalidModelState()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "RegisterTestDb")
                .Options;

            using (var dbContext = new ApplicationDbContext(options))
            {
                var controller = new AuthController(dbContext, null); // Mock MongoDbContext not used
                controller.ModelState.AddModelError("error", "some error");

                // Act
                var result = await controller.Register(new UserDto());

                // Assert
                Assert.IsType<BadRequestObjectResult>(result);
            }
        }

        /// <summary>
        /// Test to ensure that the Register method in the AuthController 
        /// correctly adds a new user to the database when provided with a valid UserDto.
        /// </summary>
        [Fact]
        public async Task Register_AddsNewUser_ForValidUserDto()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "AddUserTestDb")
                .Options;

            using (var dbContext = new ApplicationDbContext(options))
            {
                var controller = new AuthController(dbContext, null); // Mock MongoDbContext not used

                var initialUserCount = await dbContext.Users.CountAsync();

                // Create a valid UserDto
                var userDto = new UserDto
                {
                    Username = "testuser",
                    Password = "testpassword"
                };

                // Act
                await controller.Register(userDto);

                var finalUserCount = await dbContext.Users.CountAsync();

                // Assert
                Assert.Equal(initialUserCount + 1, finalUserCount);
            }
        }

    }

    public class UserDtoValidatorTests
    {
        /// <summary>
        /// Test to validate that the UserDtoValidator correctly 
        /// identifies an invalid UserDto and returns validation errors.
        /// </summary>
        [Fact]
        public void Validate_ReturnsErrors_ForInvalidUserDto()
        {
            // Arrange
            var validator = new UserService.Validators.UserDtoValidator();

            // Act
            var result = validator.Validate(new UserDto { Username = "", Password = "" });

            // Assert
            Assert.False(result.IsValid);
        }
    }

    // ... other test classes and methods for other parts of your application
}
