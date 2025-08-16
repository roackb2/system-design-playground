# System Design

Overview of high level system design principals.

## Purpose

To build a system to support each business domain and scale effectively as the business grows.

## Principals

### Apply Ubiquitous Language

The internal service namings and terminology should be exactly the same term for business usage. Non-tech personnel should be able to understand how system behaves looking at the service level code, without mental burden to understand technical implementation details.

### System Philosophies

Apply following philosophies for system design, to ensure scalability and effective communication:

- Domain Driven Design: Code and folder structure should follow domains. Each domain represents a business service or process. Each domain should has its own definition of input and output types. A service is a series of transformation to its output format and side effects.

- Explicit Side Effects: Put all side effect to the "right" of a service. The service should explicitly declare what side effects it would incur, and handle the side effects at the very end of the service.

- Hexagonal Architecture: Use ports to define contract between other components. Use adapters to implement port class and provide concrete implementations.

- Dependency Injection: The flow is composed with ports/interfaces/contracts. The top level entrypoint provides the concrete implementation class/objects.
